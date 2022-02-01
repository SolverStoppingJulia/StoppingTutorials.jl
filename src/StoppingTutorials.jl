module StoppingTutorials

deps_jl = joinpath(@__DIR__, "deps", "deps.jl")

if !isfile(deps_jl)
  s = """
  Package StoppingTutorials not installed properly.
  Run Pkg.build(\"StoppingTutorials\"), restart Julia and try again
  """
  error(s)
end

include(deps_jl)

end
